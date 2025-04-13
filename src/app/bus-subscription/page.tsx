"use client";

import Button from "~/_components/Button";
import { Text } from "~/_components/Text";
import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import "leaflet/dist/leaflet.css";

import {
  useBusSubscriptionInfo,
  useGetMyRegion,
  useGetRegions,
  useSubscribeStudentToBus,
} from "~/APIs/hooks/useBus";
import Container from "~/_components/Container";
import SearchableSelect from "~/_components/SearchSelect";
import StudentSelector from "~/_components/StudentSelector";
import { useStudentStore } from "~/APIs/store";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

function BusSubscription() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  const [openMyAddressSuccess, setOpenMyAddressSuccess] = useState(false);
  const [openMyAddressFailed, setOpenMyAddressFailed] = useState(false);
  const [openAddressForm, setOpenAddressForm] = useState(false);
  const [openConfirmSuccess, setOpenConfirmSuccess] = useState(false);
  const [notes, setNotes] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");

  const { selectedStudentId } = useStudentStore();

  const { data: regions = [] } = useGetRegions();
  const { data: myRegion } = useGetMyRegion();
  const {
    isSuccess: isSuccessSubscription,
    isError: isErrorSubscription,
    data: subscriptionInfo,
    isLoading: loadingSubscription,
  } = useBusSubscriptionInfo(myRegion?.id);

  const handleMyAddressClick = () => {
    if (loadingSubscription) return;
    if (isSuccessSubscription && subscriptionInfo) {
      setOpenMyAddressSuccess(true);
    } else if (isErrorSubscription) {
      setOpenMyAddressFailed(true);
    }
  };

  const {
    mutate: subscribeStudent,
    isPending,
    isSuccess,
    isError,
  } = useSubscribeStudentToBus();

  const handleConfirmMyAddress = () => {
    if (!myRegion?.id || !selectedStudentId) return;
    subscribeStudent({
      riderId: Number(selectedStudentId),
      regionId: myRegion.id,
      notes: "test",
      homeLocation: {
        latitude: location?.lat || 30.160733,
        longitude: location?.lng || 31.62353,
      },
    });
    setOpenMyAddressSuccess(false);
    setOpenConfirmSuccess(true);
  };

  const handleConfirmAnotherAddress = () => {
    if (!selectedRegion || !selectedStudentId) return;
    subscribeStudent({
      riderId: Number(selectedStudentId),
      regionId: Number(selectedRegion),
      notes: notes,
      homeLocation: {
        latitude: 30.160733,
        longitude: 31.62353,
      },
    });
    setOpenAddressForm(false);
    setOpenConfirmSuccess(true);
  };

  return (
    <>
      <Container>
        <div className="max-w-lg">
          <StudentSelector />
        </div>

        <div className="flex flex-col items-center justify-center px-4 pt-36">
          <img src="/images/rafiki.png" alt="Bus" className="mb-8 w-96" />
          <Text font={"semiBold"} size={"lg"} className="mb-6">
            Please choose the address for the bus pickup and drop-off:
          </Text>
          <div className="flex w-full max-w-xs flex-col space-y-4">
            <Button onClick={handleMyAddressClick}>My Address</Button>

            {/* If My Address is success */}
            <Dialog
              open={openMyAddressSuccess}
              onOpenChange={setOpenMyAddressSuccess}
            >
              <DialogContent className="text-center">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">
                    Bus Subscription Details
                  </DialogTitle>
                </DialogHeader>

                <img
                  src="/images/rafiki-2.png"
                  alt="Bus"
                  className="mx-auto my-4 w-40"
                />

                <Text>
                  Subscription Cost:{" "}
                  <strong>
                    {subscriptionInfo?.cost} {subscriptionInfo?.currency}
                  </strong>
                </Text>
                <Text className="mt-1">
                  Subscription Period: <br />
                  From <strong>
                    {subscriptionInfo?.semesterStart}
                  </strong> to <strong>{subscriptionInfo?.semesterEnd}</strong>
                </Text>

                <DialogFooter className="mt-6">
                  <Button
                    className="w-full"
                    onClick={() => {
                      setOpenMyAddressSuccess(false);
                      setOpenConfirmSuccess(true);
                      handleConfirmMyAddress();
                    }}
                  >
                    Confirm Subscription
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* If My Address is failed */}
            <Dialog
              open={openMyAddressFailed}
              onOpenChange={setOpenMyAddressFailed}
            >
              <DialogTitle className="text-xl font-semibold">
                <p className="hidden">Failed</p>
              </DialogTitle>
              <DialogContent className="text-center">
                <img
                  src="/images/alert.png"
                  alt="Error"
                  className="mx-auto my-4 h-24 w-24"
                />
                <Text size={"lg"} className="px-6">
                  The subscription fee for this region is not specified. Please
                  contact the school.
                </Text>
                <DialogFooter className="mt-6">
                  <Button
                    className="w-full"
                    onClick={() => setOpenMyAddressFailed(false)}
                  >
                    Ok
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Confirm Succsess */}
            <Dialog
              open={openConfirmSuccess}
              onOpenChange={setOpenConfirmSuccess}
            >
              <DialogTitle className="text-xl font-semibold">
                <p className="hidden">Confirm Success</p>
              </DialogTitle>
              <DialogContent className="text-center">
                <img
                  src="/images/success.png"
                  alt="Success"
                  className="mx-auto my-4 h-20 w-20"
                />
                <Text className="px-4">
                  Your bus subscription request has been sent successfully. The
                  school will review your details and respond with approval
                  shortly.
                </Text>
                <DialogFooter className="mt-6">
                  <Button
                    className="w-full"
                    onClick={() => setOpenConfirmSuccess(false)}
                  >
                    Ok
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Add Adress */}
            <Dialog open={openAddressForm} onOpenChange={setOpenAddressForm}>
              <DialogTrigger asChild>
                <Button theme="outline">Another Address</Button>
              </DialogTrigger>
              <DialogContent className="space-y-4">
                <DialogHeader>
                  <DialogTitle>Add Address</DialogTitle>
                </DialogHeader>

                <p className="text-sm text-gray-600">
                  Please provide the details for the new address:
                </p>

                <div className="mt-4">
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Region
                  </label>
                  <SearchableSelect
                    value={selectedRegion}
                    onChange={(val) => setSelectedRegion(String(val))}
                    placeholder="Select Region"
                    options={regions.map((region) => ({
                      value: region.id,
                      label: region.name,
                    }))}
                  />
                </div>

                {/* Notes */}
                <div className="mt-4">
                  <label className="mb-1 block text-sm font-medium">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    placeholder="Write any notes or requirements (such as special health needs)"
                  />
                </div>
                {/* Location Picker */}
                <div className="mt-4 space-y-2">
                  <label className="text-sm font-medium">Pick Location</label>
                  <div className="h-64 overflow-hidden rounded-md">
                    <MapContainer
                      center={[30.160733, 31.62353]}
                      zoom={13}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker
                        position={location || { lat: 30.160733, lng: 31.62353 }}
                        draggable={true}
                        eventHandlers={{
                          dragend: (e) => {
                            const marker = e.target;
                            const pos = marker.getLatLng();
                            setLocation({ lat: pos.lat, lng: pos.lng });
                          },
                        }}
                      />
                    </MapContainer>
                  </div>
                </div>

                {/* Submit Button */}
                <DialogFooter>
                  <Button
                    className="w-full"
                    onClick={() => {
                      setOpenAddressForm(false);
                      handleConfirmAnotherAddress();
                    }}
                  >
                    Submit
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Container>
    </>
  );
}

export default BusSubscription;
