#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::cell::RefCell;
use std::collections::HashMap;
use std::fs::File;
use std::io;
use std::io::{BufReader, Read, Write};
use std::path::PathBuf;
use tauri::{CustomMenuItem, Manager, Menu, MenuItem, Submenu, WindowBuilder};
use serde::{Deserialize};


// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

static FILE_EXTENSION: &'static str = "wfs";

fn add_extension_if_missing(filename: &str, extension: &str) -> String {
    if !filename.contains('.') {
        let mut file_with_extension = filename.to_owned();
        file_with_extension.push_str(".");
        file_with_extension.push_str(extension);
        return file_with_extension;
    }
    filename.to_owned()
}
#[tauri::command]
fn open_file() -> String {
    let file_path = match open_file_dialog() {
        Some(path) => path,
        None => "File not found".into(),
    };

    let contents = read_file(file_path);
    return contents.unwrap()
}


fn open_file_dialog() -> Option<PathBuf> {
    let result = nfd::open_file_dialog(Some("wfs"), None, ).expect("Error opening file dialog.");

    match result {
        nfd::Response::Okay(file_path) => Some(PathBuf::from(file_path)),
        _ => None,
    }
}

fn read_file(path: PathBuf) -> io::Result<String> {
    let file = File::open(path)?;
    let mut buf_reader = BufReader::new(file);
    let mut contents = String::new();
    buf_reader.read_to_string(&mut contents)?;
    Ok(contents)
}

#[tauri::command]
fn save_file(content: String) -> String {
    //Создаем окно выбора файла
    let mut file_path = PathBuf::new();
    file_path.set_file_name("save");
    let dialog = nfd::open_save_dialog(Some(FILE_EXTENSION), Some(&file_path).expect("REASON").to_str()).unwrap();
    // Если пользователь выбрал файл, сохраняем его содержимое в выбранном пути
    if let nfd::Response::Okay(mut path) = dialog {
        let path = add_extension_if_missing(path.as_str(), FILE_EXTENSION);
        let mut file = File::create(&path).unwrap();
        file.write_all(content.as_bytes()).unwrap();
        "File saved successfully".into()
    } else {
        "The file has not been saved".into()
    }
}

fn main() {
    let save_menu_item = CustomMenuItem::new("save".to_string(), "Save");
    let open_menu_item = CustomMenuItem::new("open".to_string(), "Open");
    let file_submenu = Submenu::new("File", Menu::new().add_item(save_menu_item).add_item(open_menu_item));
    let menu = Menu::new()
        .add_submenu(file_submenu);
    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            let window_ = window.clone();
            window.on_menu_event(move |event| {
                match event.menu_item_id() {
                    "save" => {
                        window_.eval("window.saveProject()").unwrap();
                    }
                    "open" => {
                        window_.eval("window.openProject()").unwrap();
                    }
                    _ => {}
                }
            });
            Ok(())
        })
        .menu(menu)
        .invoke_handler(tauri::generate_handler![save_file, open_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
