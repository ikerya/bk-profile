package at.gleb.bonusclass

import io.ktor.application.*
import io.ktor.http.content.files
import io.ktor.http.content.static
import io.ktor.response.*
import io.ktor.routing.get
import io.ktor.routing.routing
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty
import io.ktor.sessions.*
import io.ktor.thymeleaf.Thymeleaf
import io.ktor.thymeleaf.ThymeleafContent
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver

fun main() {
    val server = embeddedServer(Netty, port = System.getenv("PORT")?.toInt() ?: 8080) {

        install(Thymeleaf) {
            setTemplateResolver(ClassLoaderTemplateResolver().apply {
                prefix = "templates/"
                suffix = ".html"
                characterEncoding = "utf-8"
            })
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
                call.respond(ThymeleafContent("index", call.accessToken()))
            }

            get("/reg") {
                call.respond(ThymeleafContent("reg", mapOf()))
            }

            get("/reg/apply/{regId}") {
                val regId = call.parameters["regId"]
                call.respond(ThymeleafContent("reg_apply", mapOf("regId" to (regId ?: ""))))
            }

            get("/user") {
                call.respond(ThymeleafContent("index2", call.accessToken()))
            }

            get("/login") {
                call.respond(ThymeleafContent("login", call.accessToken()))
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

private fun ApplicationCall.accessToken(): Map<String, String> {
    val s = sessions.get<MySession>()
    return mapOf("accessToken" to (s?.accessToken?:""))
}

data class MySession(val accessToken: String)