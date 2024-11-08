lab 5 - junga3 - Cloud Security Alliance Book

Read the book by breaking it up throughout the week

Summary of the book:
The book gives a detailed look into cloud computing systems and the ways that it is secured. Something I noticed is that the book is more catered towards organizations and bigger cloud computing systems when compared to our VMs. The book outlines ways to address the challeges faced by cloud services and gives the risks and the main attacks such as data breaches, unauthorized access and complience issues. It gives how cloud computing is set up and how it set up with different architecture. The main part that was relevant for us and needed to be implemented was the VM security and IAM. Alot of the things touched on by the book requires higher permissions then we are allowed to have on our VMs. This is cause our VMs are managed by RPI and we dont have the permission to change these settings. Things like MFA which was talked about in the book in Doman 2 section 2.3 was not able to be implemented as we dont have the permission to change these settings.

What was implemented/Would have been if we had permission:
- Implemented an automated update for my vm with sudo apt-get install unattended-upgrades. This ensures any updates to Ubuntu security patches are installed automatically. 
- HTTPS certification was implemented before this lab but is important in encrypting a conneciton between the user and the server.
- I updated my Vm password to a more secure and something I do not use for other passwords.
- Something I could have implemented was restricting the access that was given to the user settings of the TA and Dr. Callahan. This was talked about in the book in Domain 5 more specifcally 5.2.3 about managing users that gives strong security concerns of having multiple admins for the same vm. I choose not to implement these as I would not to ruin access to my VM for the Ta's.

Citations:
Cloud Security Alliance Security Guidance v5 - https://drive.google.com/file/d/1jWzd3wrQHyUmQevr4CuAjChARvraseKb/edit
Ubuntu Unattended Updates - https://www.kolide.com/features/checks/ubuntu-unattended-upgrades
OpenWeather API Documentation - https://openweathermap.org/api

