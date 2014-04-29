require 'json'

class ApiController < ApplicationController
	def savesignup
		first = params[:first]
		last = params[:last]
		email = params[:email]
		password = params[:password]

		p first + ' | ' + last + ' | ' + email + ' | ' + password

		u = User.new(first: first, last: last, email: email, password: password)

		if (u.valid?)
			u.save
			render json: u
		else
			render json: nil
		end
	end

	def login
		email = params[:email]
		password = params[:password]

		p email + ' | ' + password

		u = User.find_by(email: email)

		if (u != nil && u.password == password)
			render json: u
		else
			render json: nil
		end
	end
end
