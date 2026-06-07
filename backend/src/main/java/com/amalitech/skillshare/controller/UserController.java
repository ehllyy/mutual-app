package com.amalitech.skillshare.controller;

import com.amalitech.skillshare.model.User;
import com.amalitech.skillshare.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/users")
@CrossOrigin
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userRepository.findById(id).orElse(null);
    }
@GetMapping("/username/{username}")
public User getUserByUsername(@PathVariable String username) {
    return userRepository.findByUsername(username).orElse(null);
}
    @PatchMapping("/{id}")
    public User updateAbout(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        User user = userRepository.findById(id).orElse(null);

        if (user == null) return null;

        user.setAbout(body.get("about"));

        return userRepository.save(user);
    }
}
