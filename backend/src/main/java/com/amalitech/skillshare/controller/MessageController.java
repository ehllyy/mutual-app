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
    
@GetMapping("/between/{user1}/{user2}")
public List<Message> getConversation(
        @PathVariable String user1,
        @PathVariable String user2
) 
    {
    return messageRepository.findBySenderAndReceiverOrSenderAndReceiver(
        user1, user2, user2, user1
    );
}
    
    @GetMapping("/{receiver}")
    public List<Message> getMessages(
            @PathVariable String receiver
    ) {
        return messageRepository.findByReceiver(receiver);
    }
}
