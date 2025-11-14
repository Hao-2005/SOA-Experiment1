package org.csu.expr1_java.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * WebClient configuration for calling Node.js service
 * As per architecture diagram: Material Service (WebClient → Node)
 */
@Configuration
public class WebClientConfig {

    @Value("${nodejs.service.url:http://localhost:8082}")
    private String nodejsServiceUrl;

    @Bean
    public WebClient webClient() {
        return WebClient.builder()
                .baseUrl(nodejsServiceUrl)
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(10 * 1024 * 1024))
                .build();
    }
}

