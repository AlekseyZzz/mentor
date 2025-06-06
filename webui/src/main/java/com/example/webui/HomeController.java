package com.example.webui;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.Map;

@Controller
public class HomeController {
    private final RestTemplate rest = new RestTemplate();

    @GetMapping("/")
    public String home(Model model) {
        List<?> reflections = rest.getForObject("http://backend:8080/reflections", List.class);
        model.addAttribute("reflections", reflections);
        return "index";
    }
}
