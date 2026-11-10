<?php
header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/db.php';

$query = isset($_GET['q']) ? trim($_GET['q']) : '';

if ($query !== '') {
    $sql = "SELECT books.id, books.title, books.author, subjects.name AS subject 
            FROM books 
            JOIN subjects ON books.subject_id = subjects.id 
            WHERE books.title LIKE :titleQuery OR books.author LIKE :authorQuery 
            ORDER BY books.title ASC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        'titleQuery' => '%' . $query . '%', 
        'authorQuery' => '%' . $query . '%',
    ]);
} else {
    $sql = "SELECT books.id, books.title, books.author, subjects.name AS subject 
            FROM books 
            JOIN subjects ON books.subject_id = subjects.id 
            ORDER BY books.title ASC";
    $stmt = $pdo->query($sql);
}

$books = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($books);