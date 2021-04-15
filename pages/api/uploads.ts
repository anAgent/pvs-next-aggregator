import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import multer from 'multer';
import * as fs from 'fs';
import { ApiResponse } from '../../libs/interfaces';
import { formidable, IncomingForm } from 'formidable';
interface NextConnectApiRequest extends NextApiRequest {
  // @ts-ignore
  files: Express.Multer.File[];
}
type ResponseData = ApiResponse<string[], string>;

const oneMegabyteInBytes = 1000000;
const outputFolderName = './public/uploads';

const upload = multer({
  limits: { fileSize: oneMegabyteInBytes * 2 },
  storage: multer.diskStorage({
    destination: './public/uploads',
    // @ts-ignore
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
  fileFilter: (req, file, cb) => {
    const acceptFile: boolean = ['json/json'].includes(file.mimetype);
    cb(null, acceptFile);
  },
});

const apiRoute = nextConnect({
  onError(
    error,
    req: NextConnectApiRequest,
    res: NextApiResponse<ResponseData>
  ) {
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req: NextConnectApiRequest, res: NextApiResponse<ResponseData>) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.array('theFiles'));

apiRoute.post(
  async (req: NextConnectApiRequest, res: NextApiResponse<ResponseData>) => {
    // // @ts-ignore
    // const filenames = fs.readdirSync(outputFolderName);
    // // @ts-ignore
    // const images = filenames.map((name) => name);
    //
    // const fileData = await new Promise((resolve, reject) => {
    //   const form = new IncomingForm();
    //
    //   form.parse(req, (err, fields, files) => {
    //     if (err) return reject(err);
    //     resolve({ fields, files });
    //   });
    // });
    //
    // // @ts-ignore
    // const contents = await fs.readFile(fileData?.files?.nameOfTheInput.path, {
    //   encoding: 'utf8',
    // });

    try {
      const form = formidable({ multiples: true });

      form.parse(req, (err, fields, files) => {
        if (err) {
          //next(err);
          return;
        }
        //@ts-ignore
        res.json({ fields, files });
      });
    } catch (e) {
      res.status(404).json({
        //@ts-ignore
        msg: e.message,
      });
    }

    // res.status(200).json({
    //   data: images,
    //   // @ts-ignore
    //   text: contents,
    // });
  }
);

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
export default apiRoute;
