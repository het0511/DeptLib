package com.library.controller;

import com.library.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/books")
    public ResponseEntity<Map<String, Object>> getBookAnalytics() {
        return ResponseEntity.ok(analyticsService.getBookAnalytics());
    }

    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getUserAnalytics() {
        return ResponseEntity.ok(analyticsService.getUserAnalytics());
    }
}
