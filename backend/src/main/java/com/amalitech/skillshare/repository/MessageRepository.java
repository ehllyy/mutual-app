package com.amalitech.skillshare.repository;

import com.amalitech.skillshare.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository
        extends JpaRepository<Message, Long> {

    List<Message> findByReceiver(String receiver);
List<Message> findBySenderAndReceiverOrSenderAndReceiver(
    String sender1, String receiver1,
    String sender2, String receiver2
);
}
