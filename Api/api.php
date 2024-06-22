<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

require 'dbcon.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'OPTIONS':
        http_response_code(200);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['title']) || !isset($data['description']) || !isset($data['completed'])) {
            http_response_code(400);
            echo json_encode(["message" => "Invalid input"]);
            break;
        }

        $title = $conn->real_escape_string($data['title']);
        $description = $conn->real_escape_string($data['description']);
        $completed = intval($data['completed']);

        error_log("Title: " . $title);
        error_log("Description: " . $description);
        error_log("Completed: " . $completed);

        $sql = "INSERT INTO todos (title, description, completed) VALUES ('$title', '$description', $completed)";
        
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["id" => $conn->insert_id]);
        } else {
            error_log("Error creating todo: " . $conn->error); 
            http_response_code(500);
            echo json_encode(["message" => "Error creating todo: " . $conn->error]);
        }
        break;

    case 'GET':
        if (isset($_GET['id'])) {
            $id = intval($_GET['id']);
            $sql = "SELECT * FROM todos WHERE id = $id";
            $result = $conn->query($sql);

            if ($result->num_rows > 0) {
                echo json_encode($result->fetch_assoc());
            } else {
                http_response_code(404);
                echo json_encode(["message" => "Todo not found"]);
            }
        } else {
            $sql = "SELECT * FROM todos";
            $result = $conn->query($sql);

            $todos = [];
            while($row = $result->fetch_assoc()) {
                $todos[] = $row;
            }
            echo json_encode($todos);
        }
        break;

    case 'PUT':
        if (isset($_GET['id'])) {
            $id = intval($_GET['id']);
            $data = json_decode(file_get_contents("php://input"), true);
            $title = $conn->real_escape_string($data['title']);
            $description = $conn->real_escape_string($data['description']);
            $completed = intval($data['completed']);

            $sql = "UPDATE todos SET title='$title', description='$description', completed=$completed WHERE id=$id";
            
            if ($conn->query($sql) === TRUE) {
                echo json_encode(["message" => "Todo updated successfully"]);
            } else {
                http_response_code(500);
                echo json_encode(["message" => "Error updating todo: " . $conn->error]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Invalid ID"]);
        }
        break;

    case 'DELETE':
        if (isset($_GET['id'])) {
            $id = intval($_GET['id']);
            $sql = "DELETE FROM todos WHERE id = $id";
            
            if ($conn->query($sql) === TRUE) {
                echo json_encode(["message" => "Todo deleted successfully"]);
            } else {
                http_response_code(500);
                echo json_encode(["message" => "Error deleting todo: " . $conn->error]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Invalid ID"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
        break;
}

$conn->close();
?>
