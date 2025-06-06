package com.example.backend;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/reflections")
public class PostSessionController {
    private final PostSessionReflectionRepository repository;

    public PostSessionController(PostSessionReflectionRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<PostSessionReflection> all() {
        return repository.findAll();
    }

    @PostMapping
    public PostSessionReflection create(@RequestBody PostSessionReflection reflection) {
        return repository.save(reflection);
    }
}
