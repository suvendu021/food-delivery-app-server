const AsyncHandler = (fun) => async (req, res, next) => {
  try {
    return await fun(req, res, next);
  } catch (error) {
    return res.status(error.code || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export { AsyncHandler };
