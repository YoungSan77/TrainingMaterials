plugins {
    java
}

repositories {
    mavenCentral()
}

dependencies {
    testImplementation("org.junit.jupiter:junit-jupiter:5.11.4")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.withType<JavaCompile>().configureEach {
    options.release = 17
    options.encoding = "UTF-8"
}

tasks.test {
    useJUnitPlatform()
    testLogging { events("passed", "failed") }
}

// 업무 패키지는 연동·영속을 의존하지 않고, 업무 사이는 허용 목록만 쓴다.
val business = setOf("order", "payment", "delivery", "product")
val allowed = setOf("order->payment", "order->delivery", "order->product")
val classesDir = layout.buildDirectory.dir("classes/java/main")

fun edges(dir: java.io.File, level: String): List<Pair<String, String>> {
    val jdeps = ProcessBuilder("jdeps", "-verbose:$level", "-filter:none", dir.absolutePath)
        .redirectErrorStream(true).start()
    val output = jdeps.inputStream.bufferedReader().readText()
    check(jdeps.waitFor() == 0) { "jdeps 실행 실패:\n$output" }
    val edge = Regex("""^\s+([\w.]+)\s+->\s+([\w.]+)\s""")
    return output.lineSequence().mapNotNull { edge.find(it) }
        .map { it.groupValues[1] to it.groupValues[2] }
        .filter { (from, to) -> from != to && !to.startsWith("java.") }
        .distinct().toList()
}

val dependencyRules = tasks.register("dependencyRules") {
    group = "verification"
    description = "업무 패키지의 의존 규칙을 검사한다"
    dependsOn(tasks.named("classes"))
    val dir = classesDir
    doLast {
        val problems = mutableListOf<String>()
        for ((from, to) in edges(dir.get().asFile, "package")) {
            val source = from.substringBefore('.')
            val target = to.substringBefore('.')
            if (source in business && (target.endsWith("adapter") || target == "persistence")) {
                problems += "$from -> $to\n" +
                    "    업무 패키지는 연동·영속을 알지 못한다. 포트 인터페이스를 선언해 그것만 쓰고,\n" +
                    "    구현을 끼우는 일은 업무 밖에서 한다. 규칙은 docs/아키텍처.md에 있다."
            }
            if (source in business && target in business && source != target && "$source->$target" !in allowed) {
                problems += "$from -> $to\n" +
                    "    허용 목록에 없는 업무 간 의존이다. 허용된 것은 ${allowed.joinToString(", ")}뿐이다.\n" +
                    "    필요한 값을 호출하는 쪽이 넘기도록 고치고, 규칙을 바꿔야 하면 사람에게 물어라."
            }
        }
        if (problems.isNotEmpty()) {
            throw GradleException("의존 규칙 위반 ${problems.size}건\n" + problems.joinToString("\n"))
        }
        logger.lifecycle("의존 규칙 통과: 업무의 연동·영속 의존 없음, 업무 간 허용 목록 준수")
    }
}

val coupling = tasks.register("coupling") {
    group = "verification"
    description = "클래스마다 몇 개를 알고 있는지 센다(신호, 합격선 아님)"
    dependsOn(tasks.named("classes"))
    val dir = classesDir
    doLast {
        val fanOut = edges(dir.get().asFile, "class")
            .groupBy({ it.first }, { it.second })
            .mapValues { (_, targets) -> targets.toSet().size }
            .toList().sortedByDescending { it.second }.take(5)
        logger.lifecycle("결합도 — 가장 많이 아는 클래스 다섯")
        for ((type, count) in fanOut) logger.lifecycle("  %-38s %d".format(type, count))
    }
}

tasks.check {
    dependsOn(dependencyRules, coupling)
}
