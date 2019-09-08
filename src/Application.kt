package at.gleb.bonusclass

import freemarker.cache.ClassTemplateLoader
import io.ktor.application.*
import io.ktor.freemarker.FreeMarker
import io.ktor.freemarker.FreeMarkerContent
import io.ktor.http.content.files
import io.ktor.http.content.static
import io.ktor.response.*
import io.ktor.routing.get
import io.ktor.routing.routing
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty
import io.ktor.sessions.*
import java.util.concurrent.ThreadLocalRandom


val SCHEME
    get() = if (System.getenv("PORT") != null) {
        "https"
    } else {
        "http"
    }

val API_URL
    get() = if (System.getenv("PORT") != null) {
        "$SCHEME://api.bonus-class.ru"
    } else {
        "$SCHEME://0.0.0.0:8081"
    }

val SITE_URL
    get() = if (System.getenv("PORT") != null) {
        "$SCHEME://bonus-class.ru"
    } else {
        "$SCHEME://0.0.0.0:8080"
    }

fun main() {
    val server = embeddedServer(Netty, port = System.getenv("PORT")?.toInt() ?: 8080) {
        install(FreeMarker) {
            templateLoader = ClassTemplateLoader(Application::class.java.classLoader, "templates")
        }

        install(Sessions) {
            cookie<MySession>("BC_SESSION")
        }

        routing {
            static("") {
                files("static")
            }
            static("/reg/apply") {
                files("static")
            }

            get("/") {
                call.respond(FreeMarkerContent("index.html", call.options(), "e"))
            }

            get("/ref{userId}/{landingId}") {
                val uid = call.parameters["userId"]
                val landingId = call.parameters["landingId"]

                val refUrl = "$SITE_URL/reg?ref=$uid"
                call.respond(
                    FreeMarkerContent(
                        "landing.html", call.options() +
                                mapOf("refUrl" to refUrl, "landingId" to landingId)
                    )
                )
            }

            get("/reg") {
                call.respond(FreeMarkerContent("reg.html", call.options()))
            }

            get("/reg/apply/{regId}") {
                val regId = call.parameters["regId"]
                call.respond(FreeMarkerContent("reg_apply.html", call.options() + mapOf("regId" to (regId ?: ""))))
            }

            get("/user") {
                call.respond(FreeMarkerContent("user.html", call.options()))
            }

            get("/login") {
                call.respond(FreeMarkerContent("login.html", call.options()))
            }

            get("/shop{shopId}") {
                val shopId = call.parameters["shopId"]
                call.respond(FreeMarkerContent("shop.html", call.options() + mapOf("shopId" to (shopId ?: ""))))
            }

            get("/reg/session/start/{accessToken}") {
                val regId = call.parameters["accessToken"]
                call.sessions.set(MySession(regId!!))
                call.respondRedirect("/", permanent = false)
            }

            get("/reg/session/stop") {
                call.sessions.clear<MySession>()
                call.respondRedirect("/", permanent = false)
            }
        }
    }
    server.start(wait = true)
}

val appVersion by lazy {
    rnd(1, 1000000)
}

fun rnd(min: Int, max: Int) = ThreadLocalRandom.current().nextInt(min, max + 1)


private fun ApplicationCall.options(): Map<String, String> {
    val s = sessions.get<MySession>()
    return mapOf(
        "accessToken" to (s?.accessToken ?: ""),
        "version" to appVersion.toString(),
        "apiPath" to API_URL
    )
}

data class MySession(val accessToken: String)