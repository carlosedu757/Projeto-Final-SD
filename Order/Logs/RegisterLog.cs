namespace Order.Logs;

public static class RegisterLog
{
    public static void RegisterDetails(string methodName, string details)
    {
        
    }
    
    public static void RegisterError(string methodName, string cause, string message)
    {
        var now = DateTime.Now;
    }
}