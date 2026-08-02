import Setting from '../models/settingModel.js';

// upsert:true means the very first read creates the document with schema
// defaults — no separate seed script needed.
export const getSettings = async () => {
  const settings = await Setting.findOneAndUpdate(
    {},
    { $setOnInsert: {} },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  return settings;
};

export const updateSettings = async (updates) => {
  const settings = await Setting.findOneAndUpdate(
    {},
    { $set: updates },
    { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
  );
  return settings;
};