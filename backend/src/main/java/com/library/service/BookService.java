package com.library.service;

import com.library.dto.BookDto;
import com.library.exception.ResourceNotFoundException;
import com.library.model.Book;
import com.library.repository.BookRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public List<BookDto> getAllBooks() {
        return bookRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public BookDto getBookById(String id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book", "id", id));
        return mapToDto(book);
    }

    public List<BookDto> getBooksByDepartment(String department) {
        return bookRepository.findByDepartment(department).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<BookDto> searchBooks(String query) {
        return bookRepository.searchBooks(query).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Add a new book
    public BookDto addBook(BookDto bookDto) {
        Book book = mapToEntity(bookDto);
        Book savedBook = bookRepository.save(book);
        return mapToDto(savedBook);
    }

    // Update an existing book
    public BookDto updateBook(String id, BookDto bookDto) {
        Book existingBook = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book", "id", id));

        existingBook.setTitle(bookDto.getTitle());
        existingBook.setAuthor(bookDto.getAuthor());
        existingBook.setDescription(bookDto.getDescription());
        existingBook.setCoverImage(bookDto.getCoverImage());
        existingBook.setDepartment(bookDto.getDepartment());
        existingBook.setPrice(bookDto.getPrice());
        existingBook.setAvailableForPurchase(bookDto.isAvailableForPurchase());
        existingBook.setAvailableForBorrow(bookDto.isAvailableForBorrow());
        existingBook.setStock(bookDto.getStock());

        Book updatedBook = bookRepository.save(existingBook);
        return mapToDto(updatedBook);
    }

    // Delete a book by ID
    public void deleteBook(String id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book", "id", id));
        bookRepository.delete(book);
    }

    private BookDto mapToDto(Book book) {
        BookDto bookDto = new BookDto();
        bookDto.setId(book.getId());
        bookDto.setTitle(book.getTitle());
        bookDto.setAuthor(book.getAuthor());
        bookDto.setDescription(book.getDescription());
        bookDto.setCoverImage(book.getCoverImage());
        bookDto.setDepartment(book.getDepartment());
        bookDto.setPrice(book.getPrice());
        bookDto.setAvailableForPurchase(book.isAvailableForPurchase());
        bookDto.setAvailableForBorrow(book.isAvailableForBorrow());
        bookDto.setStock(book.getStock());
        return bookDto;
    }

    private Book mapToEntity(BookDto bookDto) {
        Book book = new Book();
        book.setTitle(bookDto.getTitle());
        book.setAuthor(bookDto.getAuthor());
        book.setDescription(bookDto.getDescription());
        book.setCoverImage(bookDto.getCoverImage());
        book.setDepartment(bookDto.getDepartment());
        book.setPrice(bookDto.getPrice());
        book.setAvailableForPurchase(bookDto.isAvailableForPurchase());
        book.setAvailableForBorrow(bookDto.isAvailableForBorrow());
        book.setStock(bookDto.getStock());
        return book;
    }
}
