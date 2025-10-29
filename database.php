<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Простая файловая база данных
$dataFile = 'data.json';

// Инициализация данных
function initializeData() {
    global $dataFile;
    
    if (!file_exists($dataFile)) {
        $initialData = [
            'machines' => [
                ['machine_code' => 'M001', 'country' => 'Германия', 'year' => 2018, 'brand' => 'Siemens'],
                ['machine_code' => 'M002', 'country' => 'Япония', 'year' => 2020, 'brand' => 'Mazak'],
                ['machine_code' => 'M003', 'country' => 'Россия', 'year' => 2015, 'brand' => 'Станкосиб']
            ],
            'repair_types' => [
                ['repair_code' => 'R001', 'repair_name' => 'Текущий ремонт', 'duration' => 3, 'cost' => 15000, 'notes' => 'Замена изношенных деталей'],
                ['repair_code' => 'R002', 'repair_name' => 'Капитальный ремонт', 'duration' => 10, 'cost' => 50000, 'notes' => 'Полная разборка и замена основных узлов'],
                ['repair_code' => 'R003', 'repair_name' => 'Техническое обслуживание', 'duration' => 1, 'cost' => 5000, 'notes' => 'Регулярное ТО']
            ],
            'repair_works' => [
                ['machine_code' => 'M001', 'repair_code' => 'R001', 'start_date' => '2024-01-15', 'notes' => 'Ремонт выполнен в срок'],
                ['machine_code' => 'M002', 'repair_code' => 'R003', 'start_date' => '2024-02-01', 'notes' => 'Плановое ТО']
            ]
        ];
        file_put_contents($dataFile, json_encode($initialData));
    }
}

// Получение данных
function getData() {
    global $dataFile;
    initializeData();
    return json_decode(file_get_contents($dataFile), true);
}

// Сохранение данных
function saveData($data) {
    global $dataFile;
    file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT));
}

// Обработка запросов
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'],'/'));
$table = $request[0] ?? '';

$data = getData();

switch ($method) {
    case 'GET':
        if ($table && isset($data[$table])) {
            echo json_encode($data[$table]);
        } else {
            echo json_encode($data);
        }
        break;
        
    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        
        if ($table && isset($data[$table])) {
            $data[$table][] = $input;
            saveData($data);
            echo json_encode(['success' => true]);
        }
        break;
        
    case 'DELETE':
        if ($table && isset($data[$table]) && isset($_GET['id'])) {
            $id = $_GET['id'];
            // Простая реализация удаления по индексу
            array_splice($data[$table], $id, 1);
            saveData($data);
            echo json_encode(['success' => true]);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}
?>