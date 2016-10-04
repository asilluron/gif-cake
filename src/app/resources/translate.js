var translateResource = function ($resource, API_KEY, API_URL) {
  return $resource(API_URL + '/translate', {
    api_key: API_KEY
  });
};

translateResource.$inject = ['$resource', 'API_KEY', 'API_URL'];

module.exports = translateResource;
