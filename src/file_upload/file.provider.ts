import { FILE_PROVIDER } from "../../constants";
import { FileService } from "./file.service";

export const fileProvider = [
    {
      provide: FILE_PROVIDER,
      useFactory: async () => {
        const fileUpload = new FileService();
        return fileUpload;
      },
    },
  ];