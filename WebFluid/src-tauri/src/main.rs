#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::fs::File;
use std::io::Write;
use std::path::PathBuf;
use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

static FILE_EXTENSION: &'static str = "wfs";

#[tauri::command]


fn save_file(content: &str) {
    // Создаем окно выбора файла
    let mut file_path = PathBuf::new();
    file_path.set_file_name("save.wfs");
    let dialog = nfd::open_save_dialog(Some(FILE_EXTENSION), Some(&file_path).expect("REASON").to_str()).unwrap();
    // Если пользователь выбрал файл, сохраняем его содержимое в выбранном пути
    if let nfd::Response::Okay(mut path) = dialog {
        path = path.as_str().to_owned() + "." + FILE_EXTENSION;
        let mut file = File::create(&path).unwrap();
        file.write_all(content.as_bytes()).unwrap();
        println!("Файл успешно сохранен по пути {}", path);
    } else {
        println!("Файл не был сохранен");
    }
}

fn main() {
    let save_menu_item = CustomMenuItem::new("save".to_string(), "Save");
    let file_submenu = Submenu::new("File", Menu::new().add_item(save_menu_item));
    let menu = Menu::new()
        .add_submenu(file_submenu);
    tauri::Builder::default()
        .menu(menu)
        .invoke_handler(tauri::generate_handler![save_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
