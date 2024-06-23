import { Global, Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { CustomFileInterceptor } from "../interceptors/file.interceptor";

@Global()
@Module({
    imports: [
        MulterModule.register({
            fileFilter: (req, file, callback) => {
              if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                return callback(new Error, false);
              }
              if (file.size > 1024 * 1024 * 10) {
                return callback(new Error, false);
              }
              callback(null, true);
            }
          }),
    ],
    providers: [        
        CustomFileInterceptor,
    ],
    exports: [
        CustomFileInterceptor,       
    ]
})

export class FileModule{}