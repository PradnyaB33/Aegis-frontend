import { zodResolver } from "@hookform/resolvers/zod";

const Form2 = ({ isLastStep, nextStep, prevStep }) => {
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    const fileSizeLimit = 150 * 1024;
    if (selectedFile && selectedFile.size > fileSizeLimit) {
      setErrorMessage("File size exceeds the limit of 150kb.");
    } else {
      setFile(selectedFile);
      setErrorMessage("");
    }
  };
  console.log(file);

  const ApplyJobRoleSchema = z.object({});

  const { handleSubmit } = useForm({
    resolver: zodResolver(ApplyJobRoleSchema),
  });

  const onsubmit = (data) => {
    console.log(data);
    setStep2Data(data);
    nextStep();
  };

  return (
    <div className="w-full mt-4 px-2 sm:px-4 lg:px-6">
      <h1 className="text-xl mb-4 font-bold">Upload Resume</h1>

      <form
        onSubmit={handleSubmit(onsubmit)}
        className="w-full flex flex-col space-y-4"
      >
        <div className="space-y-2">
          <FormControl>
            <FormLabel htmlFor="file-upload" className="text-md mb-2">
              Upload Document
            </FormLabel>
            <div style={{ display: "flex", alignItems: "center" }}>
              <label htmlFor="file-upload">
                <input
                  style={{ display: "none" }}
                  id="file-upload"
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
                <Button variant="contained" component="span">
                  Upload Document
                </Button>
              </label>
              {file && <p className="text-green-500 ml-2 mt-2">{file.name}</p>}
            </div>
            {errorMessage && (
              <p className="text-red-500 mt-2">{errorMessage}</p>
            )}
          </FormControl>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              prevStep();
            }}
            className="w-full sm:w-auto flex justify-center px-4 py-2 rounded-md text-md font-semibold text-white bg-blue-500 hover:bg-blue-700 focus:outline-none"
          >
            Prev
          </button>
          <button
            type="submit"
            disabled={isLastStep}
            className="w-full sm:w-auto flex justify-center px-4 py-2 rounded-md text-md font-semibold text-white bg-blue-500 hover:bg-blue-700 focus:outline-none"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form2;
