package com.amalitech.skillshare.controller;

import com.amalitech.skillshare.model.User;
import com.amalitech.skillshare.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userRepository.save(user);
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null || !user.getPassword().equals(password)) {
            return Map.of("message", "Invalid credentials");
        }
        return Map.of(
            "message", "Login Successful",
            "id", user.getId(),
            "username", user.getUsername(),
            "email", user.getEmail()
        );
    }
}
