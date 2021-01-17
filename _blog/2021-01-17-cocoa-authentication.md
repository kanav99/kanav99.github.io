---
title: Authentication in Cocoa (macOS) Applications

---

Running privilidged code is impossible in app sandbox. But sometimes, you need administrative or `sudo` privilidges to perform certain tasks. For instance, vmnet.framework needs either `sudo` privilidges or proper signing (for which you need Apple's [blessing](https://developer.apple.com/documentation/bundleresources/entitlements/com_apple_vm_networking)) to work. Unfortunately, Swift (as of 17 Jan 2021) doesn't provide any API to get administrative privilidges for a non sandboxed app. Luckily, Swift has a really great interop with C, C++ and especially Objective-C. So, We will use good old Objective-C to request such privilidges.

![]({{ '/static/blog/swift-auth.png' | prepend: site.baseurl | replace: '//', '/' }}){: style="width:60%"}


1. From XCode's new file menu, create a new Objective-C file.

   ![]({{ '/static/blog/xcode-addfile.png' | prepend: site.baseurl | replace: '//', '/' }}){: style="width:80%"}


2. It will ask if you want to create a bridging header, create one. This will add two files - one is an Objective-C file (`.m` extension) and the other one is the bridging header (`.h` extension). This file acts as the point of communication between Swift and Objective-C (or C/C++). If you want to make a function from C available in Swift, you need to add their declaration to this header.

   ![]({{ '/static/blog/xcode-bridge.png' | prepend: site.baseurl | replace: '//', '/' }}){: style="width:80%"}


3. We now implement the function which calls a command, but with sudo privilidges. This function is inspired/taken from this [wiki](https://github.com/michaelvobrien/OSXSimpleAuth/wiki).

   ```c
	#import <Foundation/Foundation.h>

	int auth (NSString *command, NSMutableArray *args, NSPipe *outputBuf) {
	    @autoreleasepool {
	        // Create authorization reference
	        AuthorizationRef authorizationRef;
	        OSStatus status;
	        unsigned long numArgs = [args count];
	        NSFileHandle *writer = [outputBuf fileHandleForWriting];
	        
	        status = AuthorizationCreate(NULL, kAuthorizationEmptyEnvironment, kAuthorizationFlagDefaults, &authorizationRef);
	        
	        // Run the tool using the authorization reference
	        char *argList[numArgs+1];
	        for (int i = 0; i < numArgs; ++i) {
	            argList[i] = [(NSString *) args[i] UTF8String];
	        }
	        argList[numArgs] = NULL;
	        FILE *pipe = NULL;

	        status = AuthorizationExecuteWithPrivileges(authorizationRef, (char *)[command UTF8String], kAuthorizationFlagDefaults, argList, &pipe);

	        // Print to standard output
	        char readBuffer[128];
	        if (status == errAuthorizationSuccess) {
	            for (;;) {
	                ssize_t bytesRead = read(fileno(pipe), readBuffer, sizeof(readBuffer));
	                if (bytesRead < 1) break;
	                [writer writeData: [NSData dataWithBytes:(const void *) readBuffer length: bytesRead]];
	            }
	        } else {
	            NSLog(@"Authorization Result Code: %d", status);
	        }
	    }
	    return 0;
	}
   ```

   Note that instead of standard C strings, we have used `NSString *`, because this is the type which Swift recognizes as string. Same is the case of arrays where we have used `NSMutableArray`.

4. Add the function's declaration in the bridging header.

   ```c
   #import <Foundation/Foundation.h>

   int auth (NSString *command, NSMutableArray *args, NSPipe *outputBuf);
   ```

5. You can now call this function inside your swift files.

   ```swift
let output = Pipe()
auth("/full/path/to/executable", ["-v"], output)
   ```

_Protip_: The object `AuthorizationRef authorizationRef` can be saved as a global object and reused to make the application not ask for password everytime you want to run a privilidged command.
