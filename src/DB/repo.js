export async function findAllDocs({
  model,
  filter,
  projection,
  pagination = { limit: 5, page: 1 },
  populate = "",
}) {
  const query = model.find(filter, projection);

  if (populate) {
    query.populate(populate);
  }

  if (pagination) {
    const { limit, page } = pagination;
    const skip = (page - 1) * limit;

    query.skip(skip);
    query.limit(limit);
  }

  return await query.exec();
}

export async function findOneDoc({ model, filter, projection }) {
  return await model.findOne(filter, projection);
}

export async function findDocById({ model, id, projection }) {
  return await model.findById(id, projection);
}

export async function createDoc({ model, data, options }) {
  return await model.create([data], options);
}

export async function deleteDoc({ model, filter }) {
  return await model.deleteOne(filter);
}
