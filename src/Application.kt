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
                call.respond(FreeMarkerContent("index.html", call.accessToken(), "e"))
            }


            get("/reg") {
                call.respond(FreeMarkerContent("reg.html", call.accessToken()))
            }

            get("/reg/apply/{regId}") {
                val regId = call.parameters["regId"]
                call.respond(FreeMarkerContent("reg_apply.html", call.accessToken() + mapOf("regId" to (regId ?: ""))))
            }

            get("/user") {
                call.respond(FreeMarkerContent("index2.html", call.accessToken()))
            }

            get("/login") {
                call.respond(FreeMarkerContent("login.html", call.accessToken()))
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


private fun ApplicationCall.accessToken(): Map<String, String> {
    val s = sessions.get<MySession>()
    return mapOf("accessToken" to (s?.accessToken ?: ""), "version" to appVersion.toString())
}

data class MySession(val accessToken: String)