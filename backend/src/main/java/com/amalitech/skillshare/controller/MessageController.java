package com.amalitech.skillshare.controller;

import com.amalitech.skillshare.model.Message;
import com.amalitech.skillshare.repository.MessageRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/messages")
@CrossOrigin
public class MessageController {

    private final MessageRepository messageRepository;

    public MessageController(
            MessageRepository messageRepository
    ) {
        this.messageRepository = messageRepository;
    }

    @PostMapping
    public Message sendMessage(
            @RequestBody Message message
    ) {
        return messageRepository.save(message);
    }

    @GetMapping("/{receiver}")
    public List<Message> getMessages(
            @PathVariable String receiver
    ) {
        return messageRepository.findByReceiver(receiver);
    }
}