extern crate steganography;
use std::path::Path;
use steganography::encoder::Encoder;
use steganography::decoder::Decoder;
use steganography::util::{file_as_image_buffer, save_image_buffer, bytes_to_str};
use steganography::util::{file_as_dynamic_image, str_to_bytes};
use std::fs;

// #[cfg_attr(
//   all(not(debug_assertions), target_os = "windows"),
//   windows_subsystem = "windows"
// )]

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![encrypt_image, decrypt_image])
    .run(tauri::generate_context!())
    .expect("Error while running Tauri Application");
}




#[tauri::command]
fn encrypt_image(payload : &str, image : &str, output : &str, password: &str) {

  let final_payload = payload.to_string() + "-" + password;
  let encrypted = encrypt_text_helper(&final_payload, 2);

  let binding = encrypted.to_string();
  let payload = str_to_bytes(&binding);
  let destination_image = file_as_dynamic_image(image.to_string());
  let enc = Encoder::new(payload, destination_image);

  let result = enc.encode_alpha();
  save_image_buffer(result, output.to_string());
}


#[tauri::command]
fn decrypt_image(image : &str, password: &str, dlt: bool) -> String {

  if !Path::new(image).exists() {
    return "File Doesn't Exist".to_string().into();
  }

  let encoded_image = file_as_image_buffer(image.to_string());


  let dec = Decoder::new(encoded_image);
  let out_buffer = dec.decode_alpha();
  let clean_buffer: Vec<u8> = out_buffer.into_iter()
                                      .filter(|b| {
                                          *b != 0xff_u8
                                      })
                                      .collect();

  let message = bytes_to_str(clean_buffer.as_slice());
  let decrypted = decrypt_text_helper(&message, 2);

  let extracted_password = decrypted.split("-").last().unwrap();
  let message = decrypted.split("-").next().unwrap();
  

  if extracted_password == password {
    fs::remove_file(image.to_string()).unwrap();
    return message.to_string().into()
  }
  else{

    if dlt{
      fs::remove_file(image.to_string()).unwrap();
      return "Wrong Password".to_string().into();
    } else {
      return "Wrong Password".to_string().into();
    }
    
  }

}

fn encrypt_text_helper(text: &str, key: i32) -> String {
  let mut encrypted = String::new();
  for c in text.chars() {
      let encrypted_char = (c as u8 + key as u8) as char;
      encrypted.push(encrypted_char);
  }
  encrypted
}

fn decrypt_text_helper(encrypted_text: &str, key: i32) -> String {
  let mut decrypted = String::new();
  for c in encrypted_text.chars() {
      let decrypted_char = (c as u8 - key as u8) as char;
      decrypted.push(decrypted_char);
  }
  decrypted
}

// #[tauri::command]
// fn encrypt_audio(payload : &str, audio : &str, output : &str) {
//   let binding = payload.to_string();
//   let payload = str_to_bytes(&binding);

//   let destination_audio = file_as_dynamic_image(audio.to_string());
//   let enc = Encoder::new(payload, destination_audio);

//   let result = enc.encode_alpha();
//   save_image_buffer(result, output.to_string());
// }


// #[tauri::command]
// fn decrypt_audio(audio : &str) -> String {
//   let encoded_audio = file_as_image_buffer(audio.to_string());
//   let dec = Decoder::new(encoded_audio);
//   let out_buffer = dec.decode_alpha();
//   let clean_buffer: Vec<u8> = out_buffer.into_iter()
//                                       .filter(|b| {
//                                           *b != 0xff_u8
//                                       })
//                                       .collect();

//   let message = bytes_to_str(clean_buffer.as_slice());
//   fs::remove_file(audio.to_string()).unwrap();
//   message.to_string().into()
// }

// 1. Inserting encrypted image. 
// 3. Build
// 4. 3 Chances to enter password



// npm run tauri build. But skip ng build. Only build tauri project.
// npm run tauri build --skip-ng-build