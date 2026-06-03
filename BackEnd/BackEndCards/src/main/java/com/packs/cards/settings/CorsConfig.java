package com.packs.cards.settings;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Permitimos credenciales (obligatorio para el transporte de SockJS en muchos entornos)
        config.setAllowCredentials(true);
        
        // Añadimos el origen exacto de tu Frontend en Railway
        config.setAllowedOrigins(Arrays.asList("https://frontend-cartas-production.up.railway.app"));
        
        // También puedes usar patrones si cambias de dominio a menudo:
        // config.setAllowedOriginPatterns(Arrays.asList("*"));
        
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // Aplicamos esta configuración a todas las rutas de la app, incluidos los WebSockets
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}