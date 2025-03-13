package com.example.Helper.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@Controller
public class MainController {
    
    @GetMapping("/")
    public String IndexPage() {
        return "index.html";
    }

    @GetMapping("/main")
    public String MainPage() {
        return "/dist/index.html";
    }
    
    
}
