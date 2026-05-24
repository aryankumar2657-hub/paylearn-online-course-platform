package com.payment.paymentdemo.controller;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/ai")
public class AiController {

    @Value("${groq.api.key}")
    private String groqApiKey;

    @PostMapping("/recommend")
    public String recommend(@RequestBody Map<String, String> body) {

        String prompt = body.get("prompt");

        WebClient webClient = WebClient.builder()
                .baseUrl("https://api.groq.com/openai/v1/chat/completions")
                .defaultHeader("Authorization", "Bearer " + groqApiKey)
                .build();

        String response = webClient.post()
                .bodyValue(Map.of(
                        "model", "llama-3.1-8b-instant",
                        "messages", new Object[]{
                                Map.of("role", "user", "content", prompt)
                        }
                ))
                .retrieve()
                .bodyToMono(String.class)
                .block();

        return response;
    }
}