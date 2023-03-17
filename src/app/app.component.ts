import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { invoke } from '@tauri-apps/api/tauri';
import { FormGroup, FormControl } from '@angular/forms';
import { BaseDirectory, createDir, writeBinaryFile} from '@tauri-apps/api/fs';
import { desktopDir } from '@tauri-apps/api/path';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  title = 'asie';
  encodePage = true;
  decodePage = false;
  fileName = '';
  pathX = '';
  output = "";

  constructor(
    private messageService: MessageService,
    ) {}

  ngOnInit() {
    this.output = '...';

    const createDataFolder = async () => {
      await createDir("Images", {
        dir: BaseDirectory.Desktop,
        recursive: true,
      });
    };

    createDataFolder();
    console.log('initiated');
  }

  encodeForm = new FormGroup({
    file: new FormControl(null),
    password: new FormControl(''),
    payload: new FormControl(''),
    encodeRadio : new FormControl(Boolean),
  })

  decodeForm = new FormGroup({
    file: new FormControl(''),
    password: new FormControl(''),
  })

  showSuccess(summary : string | undefined, detail : string | undefined) {
    this.messageService.add({severity:'success', summary: summary, detail: detail});
  }
  showWarning(summary : string | undefined, detail : string | undefined) {
    this.messageService.add({severity:'warn', summary: summary, detail: detail});
  }
  showError(summary : string | undefined, detail : string | undefined) {
    this.messageService.add({severity:'error', summary: summary, detail: detail});
  }

  change(){
    this.fileName = '';
    this.pathX = '';
    this.output = '';
    this.encodeForm.reset();
    this.decodeForm.reset();
    this.encodePage = !this.encodePage;
    this.decodePage = !this.decodePage;
  }
  nothing(){}

  getFileName($event : any){
    this.fileName = $event.target.files[0].name;
    const file = $event.target.files[0];
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      this.saveImageToDB(this.fileName,reader.result as ArrayBuffer);
    }
  }

  

  encryptImage(){
    console.log(this.pathX);
    console.log(this.encodeForm.value.payload)
    
    let output = this.pathX.split('/');
    output.pop();
    let finalOutput = output.join('/');
    let outputN = this.fileName.split('.');
    outputN.pop();
    let finalOutputN = outputN.join('.');


    invoke('encrypt_image', {
      payload: this.encodeForm.value.payload,
      image: this.pathX,
      output: finalOutput +  '/_' + finalOutputN + '.png',
      password: this.encodeForm.value.password
    })

    this.showSuccess('Success', 'Image Encrypted');
    this.encodeForm.reset();
  }

  boom = false;
  chances = 2;

  async decryptImage(){
    console.log(this.pathX);
    await invoke('decrypt_image', {
      image: this.pathX,
      password : this.decodeForm.value.password,
      dlt : this.boom
    }).then((message) => {
      

      if (message as string == 'Wrong Password'){
        if (this.chances == 0){
          this.chances = 2;
          this.output = "Wrong Password | No More Tries Left"
          return
        }
        if (this.chances == 1){
          this.chances -= 1;
          this.boom = true;
          this.output = "Wrong Password | " + (this.chances as number + 1) + " Chance Left "
        } else {
          this.chances -= 1;
          this.showError('Error', this.output);
          this.output = "Wrong Password | " + (this.chances as number + 1) + " Chances Left "
        }
      }

      if (message as string == "File Doesn't Exist"){
        this.showWarning('Warning ⚠︎', message as string);
        this.output = "File Doesn't Exist";
      }
      
    })

  }

  saveImageToDB(filename: string, arrayBuffer: ArrayBuffer) {
    const buffer = arrayBuffer;
      writeBinaryFile({
        contents: new Uint8Array(buffer),
        path: `./Images/${filename}`
      },
      {
        dir: BaseDirectory.Desktop,
      })
      .then(async () => {
        console.log('File written');
        this.pathX = await desktopDir() + `./Images/${filename}`
      })
      .catch((err) => {
        console.log(err);
      });
    
  }

}
