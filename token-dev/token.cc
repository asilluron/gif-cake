#include <assert.h>
#include <node_api.h>

napi_value Method(napi_env env, napi_callback_info info) {
  napi_status status;
  napi_value token;
  status = napi_create_string_utf8(env, "REPLACE", 5, &token);
  assert(status == napi_ok);
  return token;
}

#define DECLARE_NAPI_METHOD(name, func)                                        \
  { name, 0, func, 0, 0, 0, napi_default, 0 }

napi_value Init(napi_env env, napi_value exports) {
  napi_status status;
  napi_property_descriptor desc = DECLARE_NAPI_METHOD("token", Method);
  status = napi_define_properties(env, exports, 1, &desc);
  assert(status == napi_ok);
  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)