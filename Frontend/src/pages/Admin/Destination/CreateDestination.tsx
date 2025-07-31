import { AnimatePresence, motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { DestinationFormOne } from "@/components/forms/DestinationFormOne";
import { DestinationFormTwo } from "@/components/forms/DestinationFormTwo";
import { useCreateDestinationForm } from "@/components/forms/useCreateDestinationForm";

export const CreateDestination = () => {
  const {
    register,
    handleSubmit,
    errors,
    files,
    setFiles,
    imagePreviews,
    setImagePreviews,
    imageError,
    isSubmitting,
    submitStatus,
    handleFileChange,
    handleImageError,
    handleCoordinatesFromLocation,
    getCurrentLocation,
    onSubmit,
  } = useCreateDestinationForm();

  return (
    <div className="min-h-screen w-full bg-white text-black overflow-auto px-4 py-6">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-lg border border-black rounded-xl bg-white">
            <CardHeader className="bg-black text-white py-6 px-6 rounded-t-xl">
              <CardTitle className="text-3xl font-bold flex items-center gap-3">
                <MapPin className="w-8 h-8" />
                Add New Destination
              </CardTitle>
              <CardDescription className="text-gray-300 mt-2 text-sm">
                Share a magical place with travelers around the world
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 md:p-8">
              <AnimatePresence>
                {submitStatus === "success" && (
                  <motion.div>
                    <Alert>
                      <CheckCircle />
                      <AlertDescription>
                        Destination added successfully!
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                {submitStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mb-6"
                  >
                    <Alert className="border border-black bg-white text-black">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <AlertDescription className="ml-2">
                        Failed to add destination. Please try again.
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

            <form
  onSubmit={
    handleSubmit(onSubmit)
  }
  className="space-y-8"
>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DestinationFormOne
                    register={register}
                    errors={errors}
                    getCurrentLocation={getCurrentLocation}
                    handleCoordinatesFromLocation={
                      handleCoordinatesFromLocation
                    }
                  />
                  <DestinationFormTwo
                    files={files}
                    register={register}
                    errors={errors}
                    imagePreviews={imagePreviews}
                    imageError={imageError}
                    handleFileChange={handleFileChange}
                    handleImageError={handleImageError}
                    setFiles={setFiles}
                    setImagePreviews={setImagePreviews}
                  />
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full h-14 text-lg bg-black text-white hover:bg-gray-900 transition"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin w-5 h-5 mr-2" />
                        Adding Destination...
                      </>
                    ) : (
                      <>
                        <MapPin className="w-5 h-5 mr-2" />
                        Add Destination
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
