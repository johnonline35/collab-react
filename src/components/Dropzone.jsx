import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { supabase } from "../supabase/clientapp";
import {
  Button,
  Center,
  VStack,
  HStack,
  Text,
  Square,
  Icon,
  useColorModeValue,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import { FiUploadCloud } from "react-icons/fi";

export const Dropzone = ({ userId, ...props }) => {
  const onDrop = useCallback(
    async (acceptedFiles) => {
      acceptedFiles.forEach(async (file) => {
        const reader = new FileReader();

        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading has failed");
        reader.onload = async () => {
          const binaryStr = reader.result;
          // Upload the file to Supabase storage
          try {
            let path = `collab_user_avatar/${userId}-${file.name}`;
            let response = await supabase.storage
              .from("avatars")
              .upload(path, binaryStr);

            if (response.error) {
              throw response.error;
            }
            console.log("File uploaded successfully: ", response);
          } catch (error) {
            alert(error.message);
          }
        };
        reader.readAsArrayBuffer(file);
      });
    },
    [userId]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: "image/jpeg, image/png, image/gif",
      maxSize: 2 * 1024 * 1024, // 2MB
    });

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <ListItem key={file.path}>
      {file.path} - {file.size} bytes
      <UnorderedList>
        {errors.map((e) => (
          <ListItem key={e.code}>{e.message}</ListItem>
        ))}
      </UnorderedList>
    </ListItem>
  ));

  return (
    <Center
      {...getRootProps()} // connect dropzone
      borderWidth='1px'
      borderRadius='lg'
      px='6'
      py='4'
      bg={useColorModeValue("white", "gray.800")}
      {...props}
    >
      <input {...getInputProps()} /> {/* Hidden file input */}
      <VStack spacing='3'>
        <Square size='10' bg='bg-subtle' borderRadius='lg'>
          <Icon as={FiUploadCloud} boxSize='5' color='muted' />
        </Square>
        <VStack spacing='1'>
          <HStack spacing='1' whiteSpace='nowrap'>
            <Button variant='link' colorScheme='blue' size='sm'>
              Click to upload
            </Button>
            <Text fontSize='sm' color='muted'>
              or drag and drop
            </Text>
          </HStack>
          <Text fontSize='xs' color='muted'>
            PNG, JPG or GIF up to 2MB
          </Text>
        </VStack>
      </VStack>
      {/* Display file rejections */}
      <UnorderedList>{fileRejectionItems}</UnorderedList>
    </Center>
  );
};
