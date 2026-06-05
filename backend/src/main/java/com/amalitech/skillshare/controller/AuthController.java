package com.amalitech.skillshare.controller;

import com.amalitech.skillshare.model.User;
import com.amalitech.skillshare.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

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
public Map<String, Object> login(@RequestBody LoginRequest request) {

    User user = userRepository.findByEmail(request.getEmail());

    if (user == null || !user.getPassword().equals(request.getPassword())) {
        return Map.of(
                "message", "Invalid credentials"
        );
    }

    return Map.of(
            "message", "Login Successful",
            "username", user.getUsername(),
            "email", user.getEmail(),
            "location", user.getLocation()
    );
  }
}
