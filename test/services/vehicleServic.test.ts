import { vehicleService } from "../../src/services/vehicleService";
import vehicleDetails from "../../src/models/vehicleDetails";

describe("vehicleService", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("findVehicle should give data of all vehicles", async () => {
    const mockFindOne = jest
      .spyOn(vehicleDetails, "findOne")
      .mockResolvedValueOnce({});
    await vehicleService.findVehicle({});
    expect(mockFindOne).toHaveBeenCalledWith({});
  });

  // it('addVehicle should add vehicles data', async () => {
  //   //   const mockCreate = jest.spyOn(vehicleDetails, 'create').mockResolvedValueOnce({ });
  //   await vehicleService.addVehicle({});
  //   // expect(mockCreate).toHaveBeenCalledWith({});
  // });

  it("updateVehicleDetails should change the vehicle data", async () => {
    const mockFindByIdAndUpdate = jest
      .spyOn(vehicleDetails, "findByIdAndUpdate")
      .mockResolvedValueOnce({});
    const id = "yourId";
    const updateQuery = {};
    await vehicleService.updateVehicleDetails(id, updateQuery);
    expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(id, updateQuery);
  });
});
