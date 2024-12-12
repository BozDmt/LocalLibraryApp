import { vitest } from "vitest";
import { logout } from "../controllers/sessionController";

describe('logout function',()=>{
    it('logs the user out',()=>{
        const logoutFn = logout(req,res)
        expect(logoutFn).toBe(null)
    })
})