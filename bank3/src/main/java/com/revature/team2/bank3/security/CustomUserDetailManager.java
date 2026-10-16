// package com.revature.team2.bank3.security;

// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.security.core.userdetails.UsernameNotFoundException;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.provisioning.UserDetailsManager;

// import com.revature.team2.bank3.repository.UserRepository;

// public class CustomUserDetailManager implements UserDetailsManager {

//     private final UserRepository userRepo;
//     private final BCryptPasswordEncoder passwordEncoder;

//     public CustomUserDetailManager(UserRepository userRepo, BCryptPasswordEncoder passwordEncoder){
//         this.userRepo = userRepo;
//         this.passwordEncoder=passwordEncoder;
//     }

//     @Override
//     public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//         throw new UsernameNotFoundException("User not found: " + username);
//     }

//     @Override
//     public void createUser(UserDetails user) {
//         throw new UnsupportedOperationException("createUser not implemented yet");
//     }

//     @Override
//     public void updateUser(UserDetails user) {
//         throw new UnsupportedOperationException("updateUser not implemented yet");
//     }

//     @Override
//     public void deleteUser(String username) {
//         throw new UnsupportedOperationException("deleteUser not implemented yet");
//     }

//     @Override
//     public void changePassword(String oldPassword, String newPassword) {
//         throw new UnsupportedOperationException("changePassword not implemented yet");
//     }

//     @Override
//     public boolean userExists(String username) {
//         return false;
//     }
// }
