import { useCallback, useEffect } from "react";
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
  useToast,
  ListItem,
} from "@chakra-ui/react";
import { FiUploadCloud } from "react-icons/fi";
import { useRecoilState } from "recoil";
import { avatarState } from "../atoms/avatarAtom";

export const Dropzone = ({ userId, ...props }) => {
  const [avatar, setAvatar] = useRecoilState(avatarState);
  const toast = useToast();
  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (!userId) return;

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

            // Get the public URL for the new file.
            let urlResponse = supabase.storage
              .from("avatars")
              .getPublicUrl(path);

            // Check if response includes a public URL
            if (urlResponse.error) {
              throw urlResponse.error;
            }

            let publicURL = urlResponse.data.publicUrl;
            console.log("publicUrl:", publicURL);

            // Set Avatar Recoil State
            setAvatar(publicURL);

            // Update the user's avatar URL in the collab_users table.
            const { data, error: updateError } = await supabase
              .from("collab_users")
              .update({ collab_user_avatar_url: publicURL })
              .eq("id", userId);

            if (updateError) {
              throw updateError;
            } else {
              console.log("Update data:", data);
            }

            // Show success toast
            toast({
              position: "top",
              title: "File upload successful!",
              description: "Your file upload was successful.",
              status: "success",
              duration: 2000,
              isClosable: true,
            });
          } catch (error) {
            // Error toast
            toast({
              position: "top",
              title: "Error: Upload Unsuccessful",
              description: `${error.message}`,
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
        };
        reader.readAsArrayBuffer(file);
      });
    },
    [userId, toast]
  );

  useEffect(() => {
    console.log("recoilAvatar", avatar);
    // Perform the operation that depends on the updated avatar state here
  }, [avatar]);

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
      <input {...getInputProps()} disabled={!userId} />{" "}
      {/* Disabled file input when no userId */}
      <VStack spacing='3'>
        <Square size='10' bg='bg-subtle' borderRadius='lg'>
          <Icon as={FiUploadCloud} boxSize='5' color='muted' />
        </Square>
        <VStack spacing='1'>
          <HStack spacing='1' whiteSpace='nowrap'>
            <Button
              variant='link'
              colorScheme='blue'
              size='sm'
              disabled={!userId}
            >
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
