import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../model/user.model.js";

const generateAccessTokenAndRefreshToken = async function (userId) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(400, "unAuthorize user request");
    }
    const accessToken = user.generateAccessToken();
    // console.log(accessToken);
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "problem occur during generate token"
    );
  }
};

const registerUser = AsyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;

  if ([userName, email, password].some((field) => field?.trim === "")) {
    throw new ApiError(400, "all fileds are needed to be filled !!!");
  }

  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) {
    throw new ApiError(400, "user already exist");
  }

  const createdUser = await User.create({
    userName: userName,
    email: email,
    password: password,
  });

  const user = await User.findById(createdUser?._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(500, "some error occur during creating user account");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "user is successfully register", user));
});

const logInUser = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email && !password) {
    throw new ApiError(400, "all fields are required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "user not found");
  }
  const isPassWordCorrect = await user.isPassWordCorrect(password);
  if (!isPassWordCorrect) {
    throw new ApiError(400, "unauthorized access");
  }
  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  // console.log(accessToken);
  const authenticatedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ApiResponse(200, "user successfully login !!!", {
        authenticatedUser,
        accessToken,
        refreshToken,
      })
    );
});

const logoutUser = AsyncHandler(async (req, res) => {
  // console.log(req.user);
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiResponse(200, "logout successfully"));
});

export { registerUser, logInUser, logoutUser };
