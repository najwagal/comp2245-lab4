<?php
header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/db.php';

$query = isset($_GET['q']) ? trim($_GET['q']) : '';
$subject = filter_input(INPUT_GET, 'subject', FILTER_VALIDATE_INT, [
    'options' => ['min_range' => 1]
]);
$available = filter_input(INPUT_GET, 'available', FILTER_VALIDATE_INT);

$sql = "SELECT books.id, books.title, books.author, subjects.name AS subject 
        FROM books 
        JOIN subjects ON books.subject_id = subjects.id";

$hasWhere = false;
$params = [];

if ($query !== '') {
    $sql .= " WHERE (books.title LIKE :titleQuery OR books.author LIKE :authorQuery)";
    $params[':titleQuery'] = '%' . $query . '%';
    $params[':authorQuery'] = '%' . $query . '%';
    $hasWhere = true;
}

if (is_int($subject)) {
    $sql .= $hasWhere ? " AND books.subject_id = :subject" : " WHERE books.subject_id = :subject";
    $params[':subject'] = $subject;
    $hasWhere = true;
}

if ($available === 1) {
    $sql .= $hasWhere ? " AND books.available = 1" : " WHERE books.available = 1";
    $hasWhere = true;
}

$sql .= " ORDER BY books.title ASC";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$books = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($books);