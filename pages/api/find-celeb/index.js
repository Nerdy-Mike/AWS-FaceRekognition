import {
    RekognitionClient,
    RecognizeCelebritiesCommand,
  } from '@aws-sdk/client-rekognition';
  
  import nextConnect from 'next-connect';
  import uploadFile from '../../../lib/multer';
  
  const rekogClient = new RekognitionClient({
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
  });
  
  const handler = nextConnect({
    onError: (err, _, res) => {
      return res
        .status(400)
        .json({ message: err?.message || 'Something went wrong' });
    },
  });
  
  export const config = {
    api: {
      bodyParser: false,
    },
  };
  
  handler.use(uploadFile.array('image', 2));
  
  handler.post(async (req, res) => {
    try {
      const files = req.files;
      const data = await rekogClient.send(
        new RecognizeCelebritiesCommand({
          Image: {
            Bytes: files[0].buffer,
          },
        })
      );
      return res.json({
        matchedCeleb: data,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Unable to detect faces' || 'Something went wrong',
      });
    }
  });
  
  export default handler;
  