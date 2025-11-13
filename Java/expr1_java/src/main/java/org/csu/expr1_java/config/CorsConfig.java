package org.csu.expr1_java.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOriginPatterns("*")  // 允许所有来源
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // 允许的 HTTP 方法
                        .allowedHeaders("*")  // 允许所有请求头
                        .allowCredentials(true)  // 允许携带凭证
                        .maxAge(3600);  // 预检请求的有效期（秒）
            }
        };
    }
}