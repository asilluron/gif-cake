#include <node.h>
#include <v8.h>

using namespace v8;

void getToken(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  HandleScope scope(isolate);
  args.GetReturnValue().Set(String::NewFromUtf8(isolate, "REPLACE ME"));
}

void init(Handle<Object> exports) {
  NODE_SET_METHOD(exports, "getToken", getToken);
}

NODE_MODULE(token, init);
