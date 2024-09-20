'use client';
import { storage } from "@/lib/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

interface FileUploaderProps {
  setImage: (urls: string[]) => void;  // 複数の画像URLを受け取る関数
}

const FileUploader = ({ setImage }: FileUploaderProps) => {

  // ファイルアップロード処理
  const onFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files); // ファイルを配列として取得
    if (files.length < 1) return;

    const urls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const storageRef = ref(storage, `icons/${file.name}`);

      try {
        // ファイルのアップロード
        const snapshot = await uploadBytes(storageRef, file);
        console.log("Uploaded a blob or file!", snapshot);

        // アップロード完了後、ダウンロードURLを取得
        const url = await getDownloadURL(storageRef);
        urls.push(url); // 取得したURLをリストに追加
        console.log(`File ${file.name} URL:`, url); // 取得したURLをコンソールに出力
      } catch (error) {
        console.error("Error uploading file or getting URL:", error);
      }
    }

    // URLを親コンポーネントに渡す
    setImage(urls);
  };

  return (
    <div className="w-0">
      <input
        type="file"
        onChange={onFileUpload}
        multiple
        accept=".png,.jpeg,.jpg"
        className="text-textbrawnlight font-serif"
      />
    </div>
  );
};

export default FileUploader;
