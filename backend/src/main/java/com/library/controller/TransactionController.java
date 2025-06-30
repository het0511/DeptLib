package com.library.controller;

import com.library.dto.TransactionDto;
import com.library.dto.TransactionRequest;
import com.library.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping("/user")
    public ResponseEntity<List<TransactionDto>> getUserTransactions() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Authenticated User: " + authentication.getName()); 
        return ResponseEntity.ok(transactionService.getUserTransactions(authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionDto> getTransactionById(@PathVariable String id) {
        return ResponseEntity.ok(transactionService.getTransactionById(id));
    }

    @PostMapping("/purchase")
    public ResponseEntity<TransactionDto> purchaseBook(@RequestBody TransactionRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(transactionService.purchaseBook(authentication.getName(), request.getBookId()));
    }

    @PostMapping("/borrow")
    public ResponseEntity<TransactionDto> borrowBook(@RequestBody TransactionRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(transactionService.borrowBook(authentication.getName(), request.getBookId()));
    }

    @PostMapping("/{id}/return")
    public ResponseEntity<TransactionDto> returnBook(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(transactionService.returnBook(authentication.getName(), id));
    }
}