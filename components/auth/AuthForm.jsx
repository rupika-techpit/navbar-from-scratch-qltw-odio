"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, UserPlus, LogIn, AlertCircle } from "lucide-react";
import Link from "next/link";
import { signUpSchema, loginSchema } from "../../lib/validationSchema";

export default function AuthForm({ mode = "signup", onSubmit, loading = false }) {
  const isSignUp = mode === "signup";

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, form[name]);
  };

  const validateField = async (fieldName, value) => {
    const schema = isSignUp ? signUpSchema : loginSchema;
    
    try {
      await schema.validateAt(fieldName, { [fieldName]: value });
      setErrors(prev => ({ ...prev, [fieldName]: "" }));
    } catch (error) {
      setErrors(prev => ({ ...prev, [fieldName]: error.message }));
    }
  };

  const validateForm = async () => {
    const schema = isSignUp ? signUpSchema : loginSchema;
    
    try {
      // For login, only validate email and password
      const dataToValidate = isSignUp ? form : { email: form.email, password: form.password };
      await schema.validate(dataToValidate, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error) {
      const newErrors = {};
      error.inner.forEach(err => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all relevant fields as touched
    const fieldsToTouch = isSignUp 
      ? ['firstName', 'lastName', 'email', 'password']
      : ['email', 'password'];
    
    const newTouched = {};
    fieldsToTouch.forEach(field => {
      newTouched[field] = true;
    });
    setTouched(newTouched);
    
    const isValid = await validateForm();
    if (!isValid) return;
    
    if (onSubmit) {
      // For login, only send email and password
      const submitData = isSignUp ? form : { email: form.email, password: form.password };
      onSubmit(submitData);
    }
  };

  const getFieldError = (fieldName) => {
    return touched[fieldName] && errors[fieldName];
  };

  const getInputClassName = (fieldName) => {
    const baseClass = "w-full px-3 py-2 rounded-lg border text-[var(--foreground)] bg-[var(--background)] transition-all duration-200";
    const errorClass = "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-30";
    const normalClass = "focus:outline-none focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)] focus:ring-opacity-30 hover:border-[var(--color-secondary)]";
    
    return `${baseClass} ${getFieldError(fieldName) ? errorClass : normalClass}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md rounded-2xl shadow-lg p-8"
      style={{
        borderColor: "var(--border-all)",
        backgroundColor: "var(--hover-bg)",
        boxShadow: "0 1px 3px var(--shadow-color)",
      }}
    >
      {/* Header */}
      <div className="flex flex-col items-center">
        {isSignUp ? (
          <UserPlus className="w-5 h-5 text-[var(--color-secondary)] mb-2" />
        ) : (
          <LogIn className="w-5 h-5 text-[var(--color-secondary)] mb-2" />
        )}
        <h1 className="text-2xl font-semibold">
          {isSignUp ? "Create Account" : "Login"}
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          {isSignUp ? "Join us!!" : "Welcome back!"}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mt-4" noValidate>
        {isSignUp && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClassName("firstName")}
                style={{ borderColor: getFieldError("firstName") ? "red" : "var(--border-color)" }}
              />
              {getFieldError("firstName") && (
                <div className="flex items-center mt-1 text-red-500 text-xs">
                  <AlertCircle size={12} className="mr-1" />
                  {errors.firstName}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClassName("lastName")}
                style={{ borderColor: getFieldError("lastName") ? "red" : "var(--border-color)" }}
              />
              {getFieldError("lastName") && (
                <div className="flex items-center mt-1 text-red-500 text-xs">
                  <AlertCircle size={12} className="mr-1" />
                  {errors.lastName}
                </div>
              )}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getInputClassName("email")}
            style={{ borderColor: getFieldError("email") ? "red" : "var(--border-color)" }}
          />
          {getFieldError("email") && (
            <div className="flex items-center mt-1 text-red-500 text-xs">
              <AlertCircle size={12} className="mr-1" />
              {errors.email}
            </div>
          )}
        </div>

        <div className="relative">
          <label className="block text-sm mb-1">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getInputClassName("password")}
            style={{ borderColor: getFieldError("password") ? "red" : "var(--border-color)" }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[35px] text-[var(--muted-foreground)]"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {getFieldError("password") && (
            <div className="flex items-start mt-1 text-red-500 text-xs">
              <AlertCircle size={12} className="mr-1 mt-0.5 flex-shrink-0" />
              <span>{errors.password}</span>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg font-medium text-[var(--color-on-secondary)] bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? (isSignUp ? "Creating Account..." : "Logging in...") : isSignUp ? "Sign Up" : "Login"}
        </button>
      </form>

      {/* Footer */}
      <div className="text-center mt-6 text-sm text-[var(--muted-foreground)]">
        {isSignUp ? (
          <>
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[var(--color-secondary)] hover:underline"
            >
              Log in
            </Link>
          </>
        ) : (
          <>
            Don't have an account?{" "}
            <Link
              href="/signUp"
              className="text-[var(--color-secondary)] hover:underline"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </motion.div>
  );
}